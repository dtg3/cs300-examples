using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BulletController : MonoBehaviour
{
    [SerializeField] private float speed = 10.0f;
    private CharacterController controller;
    // Start is called before the first frame update
    void Start()
    {
        controller = GetComponent<CharacterController>();
    }

    // Update is called once per frame
    void Update()
    {
        controller.Move(transform.forward * speed * Time.deltaTime);
    }

    void OnControllerColliderHit(ControllerColliderHit other)
    {
        if (other.gameObject.CompareTag("Environment"))
        {
            Destroy(gameObject);
        }

        if (other.gameObject.CompareTag("Enemy")) {
            Destroy(gameObject);
            Destroy(other.gameObject);
        }
    }
}
